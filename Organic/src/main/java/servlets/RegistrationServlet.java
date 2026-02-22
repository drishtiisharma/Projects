package servlets;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import dao.Dao;
import daoimpl.DaoImpl;
import pojo.UserInfo;


@WebServlet("/RegistrationServlet")
public class RegistrationServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	private Dao userDao=new DaoImpl();
	
 
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		
		String username=request.getParameter("username");
		String email=request.getParameter("email");
		String password=request.getParameter("password");
		String phone=request.getParameter("phone");
		String address=request.getParameter("address");
		
		
		UserInfo user=new UserInfo();
		user.setUsername(username);
		user.setEmail(email);
		user.setPassword(password);
		user.setPhone(phone);
		user.setAddress(address);
		user.setRole("customer");
		
		//call the method to register the customer
		boolean isRegistered= userDao.registerCustomer(user);
		
		if(isRegistered) {
			//registration successful, redirect to login page
			request.setAttribute("msg", "Registered Successfully. Please Log in.");
			request.getRequestDispatcher("login.jsp").forward(request,response);
		}
		else {
			//registration failed, show error message
			request.setAttribute("error", "Failed to register. Please try again.");
			request.getRequestDispatcher("registration.jsp").forward(request, response);
			
		}
	}
	
}
