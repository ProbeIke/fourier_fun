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
		
		switch(purpose) {
		
		case "Original_Input":
			QuerySin();
			
		case "Sin_Input":
			GenerateSinInputs(fourier.num_sin_functions);
				
		case "Implement_Fourier":
		
		
		}
		
		
		System.out.println("This isn't a GUI");
	}
	
	
	public static void QuerySin()
	{
		
		// Generate input for number of sin functions
		
		//Create new GUI which passes string "Sin_Input" to make sin input occur
		
		
		int sin_functions;
		
		FourierSeries fourier = new FourierSeries();
		
		fourier.num_sin_functions = sin_functions;
		
		int panelsize = 500;
		GUI sin_input = new GUI();
		sin_input.buildGUI(panelsize, "Sin_Input");
		
	}
	
	public static void GenerateSinInputs(int num_sin_functions) {
		
		
		for (int i = 0; i < num_sin_functions; i++) {
			// Generate input for sin functions
		}
		
	}
	
}
