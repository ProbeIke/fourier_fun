package fourier_fun;

import java.awt.BorderLayout;
import java.awt.GridLayout;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JButton;
import javax.swing.BorderFactory;


public class GUI {

	
	public void buildGUI(int panelsize) {
		
		JPanel panel = new JPanel();
		
		panel.setBorder(BorderFactory.createEmptyBorder(30,30,10,30));
		panel.setLayout(new GridLayout(0,1));
		
		JFrame frame = new JFrame();
		frame.setSize(panelsize,panelsize);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.setVisible(true);
		frame.add(panel);
		//frame.pack();
		frame.setVisible(true);
		
		
	}
	
	
	public void QuerySin()
	{
		
		// Generate input for number of sin functions
		
		//Create new GUI which passes string "Sin_Input" to make sin input occur
		
		
		int sin_functions;
		
		
		
		
		int panelsize = 500;
		GUI sin_input = new GUI_SinInputs();
		sin_input.buildGUI(panelsize);
		sin_input.GenerateSinInputs(sin_functions);

	}

}
