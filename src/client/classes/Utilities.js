class Utilities {
    static async fetch(url, data = {}, signal = null) {
        var request = await fetch(url, {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            method: 'POST',
            cache: 'no-cache',
            credentials: 'include',
            signal: signal || undefined,
        })

        if (request.status != 200) {
            throw new Error(await request.text())
        }

        return await request.json()
    }

    static getFormValues(form) {
        let elements = Array.from(form.elements).filter((element) => element.name)

        let inputs = {}

        elements.forEach((element) => {
            inputs[element.name] = element.value
        })

        return inputs
    }
}

if (process.env.NODE_ENV !== 'production') {
    window.debug = { ...window.debug, Utilities }
}

export default Utilities
