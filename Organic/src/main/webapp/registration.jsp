<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Registration Page</title>

  <style>
  .register-box {
    width: 550px;
    padding: 40px;
    margin: 50px auto;
    background: #ffffff;
    border-radius: 30px;
    box-shadow: 5px 5px 8px rgba(0,0,0,0.1);
  }
  
  .register-box h2 {
    text-align: center;
    color: #3b5d50;
    margin-bottom: 30px;
    font-size: 30px;
  }
  
  .register-box .form-group {
    margin-bottom: 20px;
  }
  
  .register-box label {
    display: block;
    font-weight: bold;
    color: #3b5d50;
    margin-bottom: 8px;
    font-size: 20px;
  }
  
  .register-box input[type="text"],
  .register-box input[type="password"],
  .register-box input[type="email"],
  .register-box input[type="tel"] {
    width: 100%;
    padding: 12px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 20px;
    box-sizing: border-box;
    transition: border-color 0.3s;
  }
  
  .register-box input[type="text"]:focus,
  .register-box input[type="password"]:focus,
  .register-box input[type="email"]:focus,
  .register-box input[type="tel"]:focus {
    border-color: #3b5d50;
    outline: none;
  }
  
  .register-box input[type="submit"] {
    width: 100%;
    padding: 14px;
    background-color: #3b5d50;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-top: 10px;
  }
  
  .register-box input[type="submit"]:hover {
    background-color: #2f4a3e;
  }
  
  .login-link {
    display: block;
    text-align: center;
    margin-top: 20px;
    color: #3b5d50;
    text-decoration: underline;
    font-size: 18px;
    font-weight: bold;

  }
  
  .login-link:hover {
    text-decoration: none;
    color: orange;
  }
</style>

</head>
<body>
<%@ include file="header.jsp" %>
<%--Showing success or error message --%>
<center>

<%
String msg=(String)session.getAttribute("msg");
if(msg!=null){
	%>
	<p style="color: green;"><%=msg %></p>
	<%
	session.removeAttribute("msg");
}
String error=(String)session.getAttribute("error");
if(error!=null){
	%>
	<p style="color: red;"><%=error %></p>
	<%
}
%>
</center>

<!-- Registration form -->
<section style="background-image: url('images/banner-1.jpg');background-repeat: no-repeat;background-size: cover;">
<br>
<center>
    
    <div class="register-box">
  <h2>Register</h2>

  <form action="RegistrationServlet" method="post">
    <div class="form-group">
      <input type="text" name="username" placeholder="Username" required>
    </div>

    <div class="form-group">
      <input type="email" name="email" placeholder="Email Address" required>
    </div>
    
    <div class="form-group">
      <input type="password" name="password" placeholder="Password" required>
    </div>

    <div class="form-group">
      <input type="tel" name="phone" placeholder="Contact Number">
    </div>

    <div class="form-group">
      <input type="text" name="address" placeholder="Address">
    </div>

    <input type="submit" value="Register">
    
    <a href="login.jsp" class="login-link">Already have an account? Login here</a>
  </form>
</div>
    
    
    
<br>
</center>
</section>

<%@ include file="footer.jsp" %>

</body>
</html>