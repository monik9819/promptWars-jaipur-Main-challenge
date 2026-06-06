import React from 'react';
import { PhoneCall, AlertTriangle } from 'lucide-react';

const SOSPanel = ({ className = "" }) => {
  return (
    <div className={`bg-rose-50 border border-rose-200 p-4 rounded-2xl ${className}`}>
      <div className="flex items-center space-x-2 text-rose-700 mb-3">
        <AlertTriangle className="w-5 h-5" />
        <h3 className="font-semibold">You are not alone. Help is available.</h3>
      </div>
      
      <p className="text-sm text-rose-600 mb-4">
        If you are experiencing a crisis, feeling overwhelmed, or having thoughts of self-harm, please reach out to these free, confidential helplines immediately.
      </p>
      
      <div className="space-y-3">
        <a href="tel:14416" className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-rose-100 transition-colors">
          <div>
            <div className="font-medium text-slate-800">Tele Manas (Govt Helpline)</div>
            <div className="text-sm text-slate-500">24/7 Mental Health Support</div>
          </div>
          <div className="flex items-center text-rose-600 font-semibold bg-rose-50 px-3 py-1 rounded-full">
            <PhoneCall className="w-4 h-4 mr-2" />
            14416
          </div>
        </a>

        <a href="tel:9152987821" className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-rose-100 transition-colors">
          <div>
            <div className="font-medium text-slate-800">iCall</div>
            <div className="text-sm text-slate-500">Mon-Sat, 10 AM - 8 PM</div>
          </div>
          <div className="flex items-center text-rose-600 font-semibold bg-rose-50 px-3 py-1 rounded-full">
            <PhoneCall className="w-4 h-4 mr-2" />
            9152987821
          </div>
        </a>
        
        <a href="tel:9820466627" className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-rose-100 transition-colors">
          <div>
            <div className="font-medium text-slate-800">AASRA</div>
            <div className="text-sm text-slate-500">24x7 Helpline</div>
          </div>
          <div className="flex items-center text-rose-600 font-semibold bg-rose-50 px-3 py-1 rounded-full">
            <PhoneCall className="w-4 h-4 mr-2" />
            9820466627
          </div>
        </a>
      </div>
    </div>
  );
};

export default SOSPanel;
