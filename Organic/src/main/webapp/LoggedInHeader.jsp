<%@page import="pojo.UserInfo"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>LoggedIn Header</title>
</head>
<body>

<%
    HttpSession session2 = request.getSession(false);
    boolean loggedIn = (session != null && session.getAttribute("loggedInUser") != null);
    UserInfo user = loggedIn ? (UserInfo) session.getAttribute("loggedInUser") : null;
%>

<li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle p-2 mx-1" href="#" id="userDropdown"
       role="button" data-bs-toggle="dropdown" aria-expanded="false">
        <svg width="24" height="24"><use xlink:href="#user"></use></svg>
    </a> 
    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
        <% if (loggedIn) { %>
            <li><span class="dropdown-item-text">Welcome, <strong><%= user.getUsername() %></strong></span></li>
            <li><hr class="dropdown-divider"></li>
            <% if ("Admin".equalsIgnoreCase(user.getRole())) { %>
                <li><a class="dropdown-item" href="adminProfile.jsp">Admin Panel</a></li>
            <% } else { %>
                <li><a class="dropdown-item" href="MyProfile.jsp">My Profile</a></li>
            <% } %>
            <li><a class="dropdown-item" href="LogoutServlet">Logout</a></li>
        <% } else { %>
            <li><a class="dropdown-item" href="login.jsp">Login</a></li>
            <li><a class="dropdown-item" href="registration.jsp">Register</a></li>
        <% } %>
    </ul>
</li>

<div class="col-sm-8 col-lg-2 d-flex gap-5 align-items-center justify-content-center justify-content-sm-end">
            <ul class="d-flex justify-content-end list-unstyled m-0">
              <li>
                <a href="#" class="p-2 mx-1">
                  <svg width="24" height="24"><use xlink:href="#user"></use></svg>
                </a>
              </li>
              <li>
                <a href="#" class="p-2 mx-1">
                  <svg width="24" height="24"><use xlink:href="#wishlist"></use></svg>
                </a>
              </li>
              <li>
                <a href="#" class="p-2 mx-1" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCart" aria-controls="offcanvasCart">
                  <svg width="24" height="24"><use xlink:href="#shopping-bag"></use></svg>
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </header>


</body>
</html>