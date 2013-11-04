package com.lmn.Arbiter_Android.BaseClasses;

public class Server {
	public static final int DEFAULT_FLAG = -1;
	public static final String DEFAULT_SERVER_NAME = "OpenStreetMap";
	
	private int id;
	private String serverName;
	private String url;
	private String username;
	private String password;
	
	public Server(){
		this.id = -1;
		this.serverName = null;
		this.url = null;
		this.username = null;
		this.password = null;
	}
	
	public Server(String serverName, String url, 
			String username, String password, int id){
		this.serverName = serverName;
		this.url = url;
		this.username = username;
		this.password = password;
		this.id = id;
	}
	
	public String getName(){
		return serverName;
	}
	
	public void setName(String name){
		this.serverName = name;
	}
	
	public String getUrl(){
		return url;
	}
	
	public void setUrl(String url){
		this.url = url;
	}
	
	public String getUsername(){
		return username;
	}
	
	public void setUsername(String username){
		this.username = username;
	}
	
	public String getPassword(){
		return password;
	}
	
	public void setPassword(String password){
		this.password = password;
	}
	
	public int getId(){
		return id;
	}
	
	public static boolean isDefaultServer(int serverId){
		return (serverId == DEFAULT_FLAG) ? true : false;
	}
}
