package fourier_fun;

public class Initial {
	
	public static void main(String[] args) {
	
		int panelsize = 500;
		
		GUI sin_input = new GUI_NumSinInput();
		sin_input.buildGUI(panelsize);
		sin_input.GenerateInputs();
	}
}
