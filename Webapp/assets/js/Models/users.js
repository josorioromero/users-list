function Users(usersList) {
    this.usersList = usersList;

    this.getAllUsers = () => {
        return this.usersList;
    }
}

Users.prototype.getById = function (id) {
    return this.usersList.find((user) => {
        return user._id === id;
    });
}

Users.prototype.getByName = function (name) {
    return this.usersList.find((user) => {
        return user.name.toLowerCase() === name.toLowerCase();
    });
}
