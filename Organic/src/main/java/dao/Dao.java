package dao;

import pojo.UserInfo;

public interface Dao {

	UserInfo getUserbyLoginCredential(String credential, String password);
	boolean registerCustomer(UserInfo user);
	
	UserInfo getUserById(int);
}
