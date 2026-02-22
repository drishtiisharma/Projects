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


@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	private Dao userDao=new DaoImpl();
	
 
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		String credential=request.getParameter("credential");
		String password=request.getParameter("password");
		
		//input validation
		if(credential==null || credential.trim().isEmpty()) {
			request.getSession().setAttribute("error", "Email is required");
			request.getRequestDispatcher("login.jsp").forward(request,response);
			return;
		}
		
		if(password==null || password.trim().isEmpty()) {
			request.getSession().setAttribute("error", "Password is required");
			request.getRequestDispatcher("login.jsp").forward(request,response);
			return;
		}
		
		//authenticating using DAO
		UserInfo user= userDao.getUserbyLoginCredential(credential.trim(), password.trim());
		
		if(user!=null) {
			HttpSession session=request.getSession();
			session.setAttribute("loggedInUser", user);
			session.setAttribute("username", user.getUsername());
			
			if("admin".equalsIgnoreCase(user.getRole())){
				session.setAttribute("adminUser", user);
				response.sendRedirect("admin-index.jsp");
			}
			else {
				response.sendRedirect("index.jsp");
			}
		}
		else {
			request.getSession().setAttribute("error", "Invalid Username/Email or Password");
			request.getRequestDispatcher("login.jsp").forward(request, response);
		}
	}
}
