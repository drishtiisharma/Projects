package pojo;

public class UserInfo {
	private String username;
	private String email;
	private String password;
	private String role;
	private String phone;
	private String address;
	public UserInfo() {
		super();
		// TODO Auto-generated constructor stub
	}
	public UserInfo(String username, String email, String password, String role, String phone, String address) {
		super();
		this.username = username;
		this.email = email;
		this.password = password;
		this.role = role;
		this.phone = phone;
		this.address = address;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
}
