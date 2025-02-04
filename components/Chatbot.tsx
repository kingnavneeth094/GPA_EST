'use client';

import Script from 'next/script';

export default function ChatWidget() {
  return (
    <>
      <df-messenger
        project-id="crucial-matter-442807-c2"
        agent-id="6acb93e1-c517-45fe-8a4f-46f87ec46774"
        language-code="en"
        max-query-length="-1">
        <df-messenger-chat-bubble
          chat-title="Cosmos">
        </df-messenger-chat-bubble>
      </df-messenger>
      <Script
        src="https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js"
        strategy="afterInteractive"
      />
      <style jsx global>{`
        df-messenger {
          z-index: 999;
          position: fixed;
          --df-messenger-font-color: #000;
          --df-messenger-font-family: 'Inter', sans-serif;
          --df-messenger-chat-background: #f3f6fc;
          --df-messenger-message-user-background: #d3e3fd;
          --df-messenger-message-bot-background: #fff;
          bottom: 16px;
          right: 16px;
        }
      `}</style>
    </>
  );
}