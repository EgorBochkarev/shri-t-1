import { ApiResult } from "../../../server/src/api/settings";
import { Configuration } from "../../../server/src/services/rest/conf-dto";
import { Build } from "../../../server/src/services/rest/build-dto";

export default class RestService {
    private apiBase = '/api'

    getResource<T>(url:string, rowData?:boolean):Promise<T | string> {
        return fetch(`${this.apiBase}${url}`).then((response) => {
            if (rowData) {
                return response.text()
            }
            return response.json();
        })
    }

    async setResource<T>(url:string, resource?:T):Promise<T> {
        const res = await fetch(`${this.apiBase}${url}`, {
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

    async deleteResource<T>(url:string):Promise<T> {
        const res = await fetch(`${this.apiBase}${url}`, {
            method: 'DELETE'
        });
        if (!res.ok) {
            throw new Error(`Something, ${res.status}`)
        }
        const body = await res.json()
        return body;
    }

    getSettings = () => {
        return this.getResource<Configuration>('/settings');
    }

    setSettings = (settings:Configuration) => {
        return this.setResource('/settings', settings);
    }

    deleteSettings = async () => {
        const res = await this.deleteResource('/settings');
        return res;
    }

    getAllBuilds = (offset:number|string, limit:number|string) => {
        const url = [
            '/builds',
            limit ? `?offset=${offset}&limit=${limit}` : ''
        ]
        return this.getResource<Build[]>(url.join(''))
            .then((build) => Array.isArray(build) ? build : []);
    }

    getBuild = (buildId:string) => {
        return this.getResource<Build>(`/builds/${buildId}`);
    }
    startBuild = (commitHash:string) => {
        return this.setResource<Build>(`/builds/${commitHash}`);
    }
    getBuildLogs = (buildId:string) => {
        return this.getResource<string>(`/builds/${buildId}/logs/html`, true);
    }
}