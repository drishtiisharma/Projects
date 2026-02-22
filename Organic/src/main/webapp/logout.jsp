<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Logout</title>
<style>
  .logout-box {
    width: 550px;
    padding: 40px;
    margin: 50px auto;
    background: #ffffff;
    border-radius: 30px;
    box-shadow: 5px 5px 8px rgba(0,0,0,0.1);
  }
  
  .logout-box h2 {
    text-align: center;
    color: #3b5d50;
    margin-bottom: 30px;
    font-size: 30px;
  }
  
  .logout-box p {
    text-align: center;
    color: #3b5d50;
    font-size: 18px;
    margin-bottom: 30px;
  }
  
  .btn-container {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
  }
  
  .btn {
    padding: 12px 25px;
    border-radius: 50px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
    text-decoration: none;
    display: inline-block;
  }
  
  .btn-primary {
    background-color: #3b5d50;
    color: white;
    border: none;
  }
  
  .btn-primary:hover {
    background-color: #2f4a3e;
  }
  
  .btn-secondary {
    background-color: white;
    color: #3b5d50;
    border: 2px solid #3b5d50;
  }
  
  .btn-secondary:hover {
    background-color: #f5f5f5;
  }
</style>
</head>
<body>
<%@include file ="header.jsp" %>

<section style="background-image: url('images/banner-1.jpg');background-repeat: no-repeat;background-size: cover;">
<br>
<center>
    
    <div class="logout-box">
<%
HttpSession Session=request.getSession(false);
if(session!=null){
    session.invalidate();
}
%>

<h2>You have been logged out.</h2>
<p>Thank you for visiting!</p>

<div class="btn-container">
  <a href="login.jsp" class="btn btn-primary">Login again</a>
  <a href="index.jsp" class="btn btn-secondary">Go to homepage</a>
</div>
</div>
    
<br>
</center>
</section>

<%@include file ="footer.jsp" %>

</body>
</html>