import { GatsbySSR } from 'gatsby';
import { StrictMode } from 'react';
import { App } from './src/App';
import { Root } from './src/Root';

export const onRenderBody: GatsbySSR['onRenderBody'] = ({ setHeadComponents }) => {
  setHeadComponents([
    <script
      key="1"
      type="text/javascript"
      dangerouslySetInnerHTML={{
        __html: `
          (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/uqly92w8';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
        `,
      }}
    />,
    <script
      key="2"
      type="text/javascript"
      dangerouslySetInnerHTML={{
        __html: `
          window.intercomSettings = {
            api_base: "https://api-iam.intercom.io",
            app_id: "uqly92w8",
            alignment: 'left',
          };
        `,
      }}
    />,
  ]);
};

export const wrapRootElement: GatsbySSR['wrapRootElement'] = ({ element }) => (
  <StrictMode>
    <Root>{element}</Root>
  </StrictMode>
);

export const wrapPageElement: GatsbySSR['wrapPageElement'] = ({ element }) => (
  <App>{element}</App>
);
