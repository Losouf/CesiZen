package com.cesizen.app;

import android.os.Bundle;
import android.view.Display;
import android.view.WindowManager;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setHighRefreshRate();
    }

    private void setHighRefreshRate() {
        Display display = getWindowManager().getDefaultDisplay();
        Display.Mode[] modes = display.getSupportedModes();
        Display.Mode bestMode = null;
        float maxRefreshRate = 60.0f;
        for (Display.Mode mode : modes) {
            if (mode.getRefreshRate() > maxRefreshRate) {
                maxRefreshRate = mode.getRefreshRate();
                bestMode = mode;
            }
        }
        if (bestMode != null) {
            WindowManager.LayoutParams lp = getWindow().getAttributes();
            lp.preferredDisplayModeId = bestMode.getModeId();
            getWindow().setAttributes(lp);
        }
    }
}
