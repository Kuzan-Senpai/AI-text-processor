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
                
                return await new Promise((resolve, reject) => {
                    try {
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
