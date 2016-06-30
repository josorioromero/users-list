function Users(usersList) {
    this.usersList = usersList;

    this.getAllUsers = () => {
        return this.usersList;
    }

    this.getById = (id) => {
        return this.usersList.find((user) => {
            return user._id === id;
        });
    }

    this.getByName = (name) => {
        return this.usersList.find((user) => {
            return user.name.toLowerCase() === name.toLowerCase();
        });
    }
}
