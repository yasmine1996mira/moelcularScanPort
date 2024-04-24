const nmap = require('libnmap');

module.exports = {
    name: "port-scanning",

    actions: {
        async scanPorts(ctx, target) {
            try {
                
                const opts = {
                    range: [target], 
                    ports: '1-1024', 
                    timeout: 5000,
                    flags: ['-T4', '--max-rtt-timeout', '100ms'] 
                };
                console.log("j suis laaaaaaaaaaaaaaa")

                // Perform the port scan
                const report = await new Promise((resolve, reject) => {
                    nmap.scan(opts, (err, report) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(report);
                        }
                    });
                });

                return report;
            } catch (error) {
                console.error('Error occurred during port scan:', error);
                throw error;
            }
        },

        
        // Define a new action to handle the HTTP GET request for port scanning
        scanPortsRest: {
            rest: {
                method: "GET",
                path: "/scan-ports"
            },
            params: {
                target: "string" // Define the expected parameter for the target as a string
            },
            
            async handler(ctx) {
                const { target } = ctx.params;
                try {
                    // Call the scanPorts action passing the target

                    const results = await ctx.call("port-scanning.scanPorts", target);
                    return results;
                } catch (error) {
                    
                    console.error('Error occurred during port scan:', error);
                    throw error;
                }
            }
        }
    }
};
