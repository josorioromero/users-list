var users;

/*Document.ready function*/
$(function () {
    obtainUsers();

    $("#inputSearch").keyup((e) => {
      autocomplete(e);
    });

    $("#btnSearch").on("click", (e) => {
      search(e);
    });

    $("#btnClear").on("click", () => {
      $("#inputSearch").val("");
    });

    $("#newUser").on("click", () => {
      showNewUserForm();
    });

    $("#btnAdd").on("click", () => {
      addNewUser();
    });

    $("#btnUpdate").on("click", () => {
      editUser();
    });
});

/*Functions definition*/
function showNewUserForm(){
  $("#newUserName, #newUserAlias, #newUserEmail, #newUserCity, #newUserPhone").val("");
  $("#btnAdd").show();
  $("#btnUpdate").hide();
  $("#modalTitle").text("Add New User");
  $("#add-new-user").modal("show");
}

function obtainUsers(){
    var store = new userStore();

    $.when(
      store.getAll()
    )
    .done((data) => {
        users = new Users(data);
        drawResults(users);
    })
    .fail((error) => {
        users = null;
        alert("An error has ocurred when trying to fetch the users. Try again.")
    })
}

function addNewUser() {
  if (confirm("Are you sure?")) {
    var user = {
        name: $("#newUserName").val(),
        username: $("#newUserAlias").val(),
        email: $("#newUserEmail").val(),
        city: $("#newUserCity").val(),
        phone: $("#newUserPhone").val(),
    };

    $("#add-new-user").modal("hide");

    //Clean inputs
    $("#newUserName, #newUserAlias, #newUserEmail, #newUserCity, #newUserPhone").val("");

    var store = new userStore();

    $.when(
      store.post(user)
    )
    .done((data) => {
      $("#pageContent").hide();
      $("#loading").show();
      $("#users").html("");
      obtainUsers();
    })
    .fail((error) => {
        alert("An error has ocurred when trying to add the user. Try again.")
    })
  }
}

function editUser(){
  if (confirm("Are you sure?")) {
    var user = {
        _id: $("#userId").val(),
        name: $("#newUserName").val(),
        username: $("#newUserAlias").val(),
        email: $("#newUserEmail").val(),
        city: $("#newUserCity").val(),
        phone: $("#newUserPhone").val(),
    };

    var store = new userStore();

    $("#add-new-user").modal("hide");

    $.when(
      store.put(user._id, user)
    )
    .done((data) => {
      $("#pageContent").hide();
      $("#newUserName, #newUserAlias, #newUserEmail, #newUserCity, #newUserPhone, #userId").val("");
      $("#loading").show();
      $("#users").html("");
      obtainUsers();
    })
    .fail((error) => {
        alert("An error has ocurred when trying to add the user. Try again.")
    })

  }
}

function deleteUser(e){
  if (confirm("Are you sure?")) {
    var userId = users.getById(e.target.id)._id;
    var store = new userStore();

    $.when(
      store.delete(userId)
    )
    .done((data) => {
        $("#pageContent").hide();
        $("#loading").show();
        $("#users").html("");
        obtainUsers();
    })
    .fail((error) => {
        alert("An error has ocurred when trying to delete the user. Try again.")
    })
  }
}

function drawResults(users) {
    users.usersList.forEach((element) => {
      var listGroup = $("<li/>", {class: 'list-group-item'});

      var listLink = $("<a/>", {class: 'listLink no-style'}).appendTo(listGroup);

      var divUser  = $("<div/>", {class: 'pull-right'}).appendTo(listGroup);

      var editLink = $("<a/>", {
                          id: element._id,
                          class: 'editLink p-r-1 no-style',
                          title: 'Click to edit'
                     }).appendTo(divUser);

      var editIcon = $("<i/>", {class: 'fa fa-pencil', id: element._id}).appendTo(editLink);

      var deleteLink = $("<a/>", {
                          class: 'deleteLink no-style',
                          title: 'Click to delete'
                       }).appendTo(divUser);

      var deleteIcon = $("<i/>", {class: 'fa fa-trash', id: element._id}).appendTo(deleteLink);

      var spanUser = $("<span/>", {
                          id: element._id,
                          class: 'user' + element._id,
                          text: element.name
                     }).appendTo(listLink);

      $("#users").append(listGroup);
    }, this);

    //Append click event for the users on the list
    $(".listLink").on("click", (e) => {
      showUserInfo(e);
    });

    $(".deleteLink").on("click", (e) => {
      deleteUser(e);
    });

    $(".editLink").on("click", (e) => {
      var user = users.getById(e.target.id);

      $("#userId").val(user._id);
      $("#newUserName").val(user.name);
      $("#newUserAlias").val(user.username);
      $("#newUserEmail").val(user.email);
      $("#newUserCity").val(user.city);
      $("#newUserPhone").val(user.phone);

      $("#modalTitle").text("Edit User");
      $("#btnAdd").hide();
      $("#btnUpdate").show();
      $("#add-new-user").modal("show");
    });

    //Hide loader and display the pageContent
    $("#loading").hide();
    $("#pageContent").fadeIn("slow");
}

function autocomplete(e){
    var htmlContent = "";
    var term = e.currentTarget.value;
    var dictionary = users.getAllUsers();
    var searchResults;
    var filteredResults;

    if (term !== "") {
      searchResults = dictionary.filter((x) => {
        return x.name.toLowerCase().includes(term.toLowerCase());
      });

      if (searchResults.length > 0) {
        filteredResults = searchResults.map((y) => {
          return y.name;
        });
        for (var i = 0; i < filteredResults.length; i++) {
          htmlContent += "<a class='list-group-item' onclick='selectedSuggestion(this);'>" + filteredResults[i] + "</a>";
        }
      } else {
        htmlContent = "";
      }
    }

    $("#autocomplete").html(htmlContent);
}

function selectedSuggestion(e){
  $("input[type='text']").val(e.text);
  $("#autocomplete").html("");
}

function search(e){
  var term = $("input[type='text']").val();
  showUserInfo(e, true, term);
}

function showUserInfo(e, byName = false, term){
  var userInfo = null;

  if (!byName) {
    userInfo = users.getById(e.target.id);
  } else {
    userInfo = users.getByName(term);
  }

  if (userInfo) {
    $("#user-name").text(userInfo.name);
    $("#user-usrname").text(userInfo.username);
    $("#user-email").text(userInfo.email);
    $("#user-phone").text(userInfo.phone);
    $("#user-city").text(userInfo.city);

    $("#user-info-modal").modal("show");
  } else {
    $("#not-found-modal").modal("show");
  }
}
