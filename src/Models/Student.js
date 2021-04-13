class Student {
    constructor(name, gpa, preferenceList, json) {
        this.preferenceList = preferenceList;
        this.name = name;
        this.gpa = gpa;
        this.json = json;
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    setGpa(gpa) {
        this.gpa = gpa;
    }

    setJson(json) {
        this.json = json;
    }

    getJson() {
        return this.json;
    }

    setPreferenceList(preferenceList) {
        this.preferenceList = preferenceList;
    }

    getPreferenceList() {
        return this.preferenceList;
    }

}

export default Student;