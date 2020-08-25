

const date = new Date();
const year = date.getFullYear();
const month = `${date.getMonth() + 1}`.padStart(2, '0');
const day = `${date.getDate()}`.padStart(2, '0');
const today = `${year}-${month}-${day}`;

class User {
  constructor(id) {
    this.id = id;
    this.loginDate = today;
    this.loginCount = 0;
  }

  set setLoginDate(loginDate) {
    this.loginDate = loginDate;
  }

  get getLoginDate() {
    return this.loginDate;
  }

  set setLoginCount(count) {
    this.loginCount += count;
  }

  get getLoginCount() {
    return this.loginCount;
  }
}

module.exports = User;