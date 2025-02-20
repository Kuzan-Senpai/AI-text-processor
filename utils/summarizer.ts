export class Summarizer {
    private summarizer: { summarize: (text: string) => Promise<string> } | null = null;
    
        async getSummarizer() {
        try {
            if (!(self && 'ai' in self && self.ai && 'summarizer' in self.ai)) {
            throw new Error('Summarizer API is not supported in this environment');
            }
    
            if (this.summarizer) {
            return this.summarizer;
            }
    

            const capabilities = await self.ai.summarizer.capabilities();
            console.log('Summarizer capabilities:', capabilities);
            
            if (capabilities.available === 'no') {
            throw new Error(`Summarizer not available: ${capabilities.available}`);
            }
    
            // @ts-expect-error - Chrome AI types
            this.summarizer = await self.ai.summarizer.create({
            // type: 'key-points',
            // length: 'short'
            // Removed the format property since it's causing the error
            });
    
            return this.summarizer;
        } catch (error) {
            console.error('Summarizer initialization failed:', error);
            throw error;
        }
        }
    
        async summarize(text: string): Promise<string> {
            try {
                if (!text.trim()) {
                    throw new Error('Empty text provided');
                }
            
                console.log('Getting summarizer instance...');
                const summarizer = await this.getSummarizer();
                
                console.log('Starting summarization process...');
                console.log('Text length:', text.length);
                
                // Try with explicit error catching
                return await new Promise((resolve, reject) => {
                    try {
                      // Add timeout to prevent hanging
                        const timeoutId = setTimeout(() => {
                            reject(new Error('Summarization timed out'));
                        }, 30000);
                
                        summarizer.summarize(text)
                            .then((result: string) => {
                            clearTimeout(timeoutId);
                            resolve(result);
                            })
                            .catch((error: Error) => {
                            clearTimeout(timeoutId);
                            reject(error);
                            });
                        } catch (error) {
                        reject(error);
                        }
                    });
                    } catch (error) {
                    console.error('Summarization failed:', error);
                    throw error;
                }
            }
    }
