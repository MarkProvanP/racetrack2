import { ACME_CHALLENGES } from './constants';

export function letsEncryptHandler(app) {

    // Let's Encrypt!
    if (ACME_CHALLENGES) {
        let challenges = JSON.parse(ACME_CHALLENGES);
        challenges.forEach(({ request, response }) => {
            app.get(request, (req, res) => {
                res.send(response);
            })
        });
    }
}