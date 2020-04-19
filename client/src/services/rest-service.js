export default class RestService {
    #apiBase = '/api'

    async getResource(url, rowData) {
        const res = await fetch(`${this.#apiBase}${url}`);
        if (!res.ok) {
            throw new Error(`Something, ${res.status}`)
        }
        if (rowData) {
            return res.text()
        }
        return res.json();
    }

    async setResource(url, resource) {
        const res = await fetch(`${this.#apiBase}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(resource)
        });
        if (!res.ok) {
            throw new Error(`Something, ${res.status}`)
        }
        const body = await res.json()
        return body;
    }

    async deleteResource(url) {
        const res = await fetch(`${this.#apiBase}${url}`, {
            method: 'DELETE'
        });
        if (!res.ok) {
            throw new Error(`Something, ${res.status}`)
        }
        const body = await res.json()
        return body;
    }

    getSettings = () => {
        return this.getResource('/settings');
    }

    setSettings = (settings) => {
        return this.setResource('/settings', settings);
    }

    deleteSettings = async () => {
        const res = await this.deleteResource('/settings');
        return res;
    }

    getAllBuilds = (offset, limit) => {
        const url = [
            '/builds',
            limit ? `?offset=${offset}&limit=${limit}` : ''
        ]
        return this.getResource(url.join(''));
    }

    getBuild = (buildId) => {
        return this.getResource(`/builds/${buildId}`);
    }
    startBuild = (commitHash) => {
        return this.setResource(`/builds/${commitHash}`);
    }
    getBuildLogs = (buildId) => {
        return this.getResource(`/builds/${buildId}/logs/html`, true);
    }
}