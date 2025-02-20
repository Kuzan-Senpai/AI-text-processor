type LanguageDetectorResult = {
    detectedLanguage: string;
    confidence: number;
    };
    
    export class LanguageDetector {
        private detector: { detect: (text: string) => Promise<{ detectedLanguage: string; confidence: number }[]> } | null = null;
    
        async getDetector() {
            if (this.detector) {
                return this.detector;
                }
            
                try {
                // @ts-expect-error - Chrome AI types
                const capabilities = await self.ai.languageDetector.capabilities();
                const canDetect = capabilities.languageAvailable('es');
            
                if (canDetect === 'readily') {
                    // @ts-expect-error - Chrome AI types
                    this.detector = await self.ai.languageDetector.create();
                    return this.detector;
                } else {
                    throw new Error('Language detection is not available');
                }
                } catch (error) {
                console.error('Failed to initialize language detector:', error);
                throw new Error('Language detection service is not available');
                }
            }
            
            async detectLanguage(text: string): Promise<LanguageDetectorResult> {
                try {
                const detector = await this.getDetector();
                if (!detector) {
                    throw new Error('Language detector is not initialized');
                }
                const results = await detector.detect(text);
                const result = results[0];
            
                return {
                    detectedLanguage: result.detectedLanguage,
                    confidence: result.confidence
                };
                } catch (error) {
                console.error('Language detection failed:', error);
                throw new Error('Failed to detect language');
                }
            }
        }