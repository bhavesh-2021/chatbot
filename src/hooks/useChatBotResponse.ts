import { useState, useCallback } from 'react';

interface StreamChunk {
  choices: {
    delta: {
      content?: string;
    };
  }[];
}

export const useChatBotResponse = () => {
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (prompt: string) => {
    setIsLoading(true);
    setResponse('');
    setError(null);

    try {
      const res = await fetch('https://router.huggingface.co/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/Llama-3.2-1B-Instruct',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500,
          stream: true,
        }),
      });

      if (!res.ok || !res.body) throw new Error(`Fetch failed: ${res.statusText}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === 'data: [DONE]') continue;

          const jsonString = trimmed.replace(/^(data:|message)\s*/, "");
          try {
            const parsed: StreamChunk = JSON.parse(jsonString);
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
              setResponse((prev) => prev + content);
            }
          } catch (e) {
            // Partial JSON chunk, wait for next read
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { response, isLoading, error, sendMessage };
};
