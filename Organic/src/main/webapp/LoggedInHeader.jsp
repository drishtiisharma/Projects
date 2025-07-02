<%@page import="pojo.UserInfo"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
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


</body>
</html>