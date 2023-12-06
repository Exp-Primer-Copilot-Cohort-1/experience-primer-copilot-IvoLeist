function skillsMember() {
    this.skills = ['JavaScript', 'React', 'Angular'];
    this.addSkills = function (newSkill) {
        this.skills.push(newSkill);
    }
}