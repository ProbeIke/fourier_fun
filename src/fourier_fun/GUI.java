package fourier_fun;

import java.awt.BorderLayout;
import java.awt.GridLayout;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JButton;
import javax.swing.BorderFactory;


public abstract class GUI {

	
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
	
	
	public abstract void GenerateInputs();

}
