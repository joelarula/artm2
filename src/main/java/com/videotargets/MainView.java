package com.videotargets;

import java.awt.EventQueue;

import javax.swing.JFrame;
import java.awt.BorderLayout;
import javax.swing.JToolBar;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JButton;
import javax.swing.SwingConstants;
import java.awt.Button;
import javax.swing.JPanel;
import javax.swing.border.LineBorder;
import java.awt.Color;

public class MainView {

	private JFrame frmVideoTargets;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					MainView window = new MainView();
					window.frmVideoTargets.setVisible(true);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
	}

	/**
	 * Create the application.
	 */
	public MainView() {
		initialize();
	}

	/**
	 * Initialize the contents of the frame.
	 */
	private void initialize() {
		frmVideoTargets = new JFrame();
		frmVideoTargets.setTitle("Video Targets");
		frmVideoTargets.setBounds(100, 100, 600, 404);
		frmVideoTargets.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frmVideoTargets.getContentPane().setLayout(new BorderLayout(0, 0));
		
		JToolBar toolBar = new JToolBar();
		frmVideoTargets.getContentPane().add(toolBar, BorderLayout.NORTH);
		
		JToolBar sidebar = new JToolBar();
		sidebar.setOrientation(SwingConstants.VERTICAL);
		sidebar.setFloatable(false);
		frmVideoTargets.getContentPane().add(sidebar, BorderLayout.WEST);
		
		JButton toggleInf = new JButton("Info");
		sidebar.add(toggleInf);
		
		JButton toggleGrid = new JButton("Grid");
		sidebar.add(toggleGrid);
		
		JButton toggleHits = new JButton("Hits");
		sidebar.add(toggleHits);
		
		JButton toggleRawCamera = new JButton("Raw");
		sidebar.add(toggleRawCamera);
		
		JButton gotoFullScreen = new JButton("Full");
		sidebar.add(gotoFullScreen);
		
		JButton btnTest = new JButton("Test");
		sidebar.add(btnTest);
		
		JPanel canvas = new JPanel();
		canvas.setBorder(new LineBorder(Color.BLUE));
		frmVideoTargets.getContentPane().add(canvas, BorderLayout.CENTER);
		canvas.setLayout(null);
	}
}
