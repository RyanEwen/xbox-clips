export default class Base {
    static async post(url, data = {}, signal = null) {
        var request = await fetch(url, {
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
            method: 'POST',
            cache: 'no-cache',
            credentials: 'include',
            signal: signal || undefined,
        })

        var response

        if (request.status == 500) {
            response = await request.text()

            throw new Error(response)
        } else {
            response = await request.json()
        }

        return response
    }
}
