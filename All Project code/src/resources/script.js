// script.js
function openUserProfile() {
    var userProfileMenu = document.getElementById("user-profile-menu");
    userProfileMenu.style.display = userProfileMenu.style.display === "block" ? "none" : "block";
  }
  
  // Close the user profile menu if the user clicks outside of it
  window.onclick = function(event) {
    var userProfileMenu = document.getElementById("user-profile-menu");
    if (event.target !== userProfileMenu && !userProfileMenu.contains(event.target)) {
      userProfileMenu.style.display = "none";
    }
  };
  