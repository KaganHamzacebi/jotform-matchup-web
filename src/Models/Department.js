class Department {
    constructor(name, quota) {
        this.name = name;
        this.quota = quota;
        this.takenStudents = [];
    }

    addStudent(student) {
        if (this.isDepartmentEmpty()) {
            this.getTakenStudents().push(student);
            return true;
        }
        else {
            let index = this.getTakenStudents().findIndex(takenStudent => takenStudent.gpa < student.gpa);
            if(index === -1) {
                if(!this.isDepartmentFull()) {
                    this.getTakenStudents().push(student);
                    return true;
                }
                return false;
            }
            else {
                this.getTakenStudents().splice(index, 0, student);
                return true;
            }
        }
    }

    print() {
        console.log(this.name + ' Taken Students: ');
        console.log(this.takenStudents);
    }

    getName() {
        return this.name;
    }

    getQuota() {
        return this.quota;
    }

    getTakenStudents() {
        return this.takenStudents;
    }

    isDepartmentFull() {
        return this.takenStudents.length === this.quota ? true : false;
    }

    isDepartmentEmpty() {
        return this.takenStudents.length === 0 ? true : false;
    }

    isDepartmentOverloaded() {
        return this.takenStudents.length > this.quota;
    }

}

export default Department;