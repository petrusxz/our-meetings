export class MeetingModel {
    id?: string = null;
    createdBy: string = null;
    title: string = null;
    image: string = null;
    date: string = null;
    hour: string = null;
    limit: number = null;
    users: Array<string> = [];
    topics: Array<string> = [];

    constructor(values: Object = {}) {
        Object.keys(this).forEach(key => {
            if (values.hasOwnProperty(key)) { this[key] = values[key]; }
        });
    }
}