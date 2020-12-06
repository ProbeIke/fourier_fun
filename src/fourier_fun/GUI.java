package fourier_fun;

import java.awt.BorderLayout;
import java.awt.GridLayout;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JButton;
import javax.swing.BorderFactory;


public class GUI {

	
	public void buildGUI(int panelsize, String purpose) {
		
		JPanel panel = new JPanel();
		
		panel.setBorder(BorderFactory.createEmptyBorder(30,30,10,30));
		panel.setLayout(new GridLayout(0,1));
		
		JFrame frame = new JFrame();
		frame.setSize(panelsize,panelsize);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.setVisible(true);
		frame.add(panel);
		frame.setTitle("Input Number of sin functions");
		//frame.pack();
		frame.setVisible(true);
		
	}
	
	
	public void QuerySin()
	{
		
		// Generate input for number of sin functions
		
		//Create new GUI which passes string "Sin_Input" to make sin input occur
		
		
		int sin_functions;
		
		
		int panelsize = 500;
		GUI sin_input = new GUI();
		sin_input.buildGUI(panelsize, "Sin_Input");
		
	}
	
	public static void GenerateSinInputs(int num_sin_functions) {
		
		float[][] sin_coeff = new float[2][num_sin_functions];
		
		for (int i = 0; i < num_sin_functions; i++) {

			// Create input

			sin_coeff[0][i] = input_a;
			sin_coeff[1][i] = input_freq;
		}
		
	}
	
}
