package com.lmn.Arbiter_Android.Dialog.Dialogs;

import android.app.AlertDialog;
import android.view.View;

import com.lmn.Arbiter_Android.Dialog.ArbiterDialogFragment;

public class GoOfflineDialog extends ArbiterDialogFragment{
	public static GoOfflineDialog newInstance(String title, String ok, 
			String cancel, int layout){
		GoOfflineDialog frag = new GoOfflineDialog();
		
		frag.setTitle(title);
		frag.setOk(ok);
		frag.setCancel(cancel);
		frag.setLayout(layout);
		
		return frag;
	}

	@Override
	public void onPositiveClick() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void onNegativeClick() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void registerCustomListeners(View view) {
		// TODO Auto-generated method stub
		
	}
}
