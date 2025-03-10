export function parseRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (err) {
                reject(new Error('Invalid JSON body'));
            }
        });

        req.on('error', reject);
    });
}
