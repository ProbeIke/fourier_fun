package fourier_fun;

public class Initial {
	
	public static void main(String[] args) {
		GUI start = new GUI();
				
		int panelsize = 500;
		String purpose = "Original_Input";
		
		start.buildGUI(panelsize,purpose);
		start.QuerySin();
		
		
		
	}
}
