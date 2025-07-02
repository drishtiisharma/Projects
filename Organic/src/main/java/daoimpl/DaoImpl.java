package daoimpl;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.mysql.cj.protocol.Resultset;

import pojo.UserInfo;

import dao.Dao;

public class DaoImpl implements Dao{
	
	private Connection con;



	public DaoImpl() {
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			con=DriverManager.getConnection("jdbc:mysql://localhost:3306/organic","root","root");

			System.out.println("Database connected successfully");
		}
		catch(Exception e){
			System.err.println("ERROR IN CONNECTING DATABASE");
			e.printStackTrace();

		}

	}

	public UserInfo getUserbyLoginCredential(String credential, String password) {
		UserInfo user=null;
		try {
			String sql="select * from users where (emailid=? or username=?) and password=?";
			PreparedStatement ps=con.prepareStatement(sql);
			ps.setString(1, credential);
			ps.setString(2, credential);
			ps.setString(3, password);
			ResultSet rs=ps.executeQuery();


			if (rs.next()){
				user=new UserInfo();
				user.setUsername(rs.getString("username"));
				user.setEmail(rs.getString("emailid"));
				user.setPassword(rs.getString("password"));
				user.setRole(rs.getString("role"));
			}
		}
		catch(Exception e) {
			e.printStackTrace();
		}
		return user;
	}

	
	
	public boolean registerCustomer(UserInfo user) {
		boolean result=false;
		
		try {
			con.setAutoCommit(false); //begin transaction
			
			//inserting into customers table
			String customerSql="insert into customers(username,emailid,password,phone,address) values(?,?,?,?,?)";
			PreparedStatement psCustomer=con.prepareStatement(customerSql);
			psCustomer.setString(1,user.getUsername());
			psCustomer.setString(2,user.getEmail());
			psCustomer.setString(3,user.getPassword());
			psCustomer.setString(4,user.getPhone());
			psCustomer.setString(5,user.getAddress());
			psCustomer.executeUpdate();
			
			
			String userSql="insert into users(emailid,password,role, username) values(?,?,?,?)";
			
			PreparedStatement psUser=con.prepareStatement(userSql);
			psUser.setString(1, user.getEmail());
			psUser.setString(2, user.getPassword());
			psUser.setString(3, user.getRole());
			psUser.setString(4, user.getUsername());
			psUser.executeUpdate();
			
			con.commit(); //commit the transaction
			
			result=true;
		}
		catch(Exception e) {
			e.printStackTrace();
			try {
				if(con!=null) {
					con.rollback(); //rollback on failure
				}
			}
			catch(SQLException s) {
				s.printStackTrace();
			}
		}
		return result;
	}
}
