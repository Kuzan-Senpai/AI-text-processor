type TranslatorResult = {
    translatedText: string;
};

export class Translator {
    private translators: Map<string, { translate: (text: string) => Promise<string> }> = new Map();
    private isServiceAvailable: boolean = false;

    constructor() {
        this.checkServiceAvailability();
        }
    
        private async checkServiceAvailability(): Promise<void> {
        try {
            
            if (typeof self !== 'undefined' && 'ai' in self) {
            // @ts-expect-error - Chrome AI types
            await self.ai.translator.capabilities();
            this.isServiceAvailable = true;
            } else {
            console.warn('Chrome AI translator API is not available in this environment');
            this.isServiceAvailable = false;
            }
        } catch (error) {
            console.error('Failed to initialize translation service:', error);
            this.isServiceAvailable = false;
        }
        }
    
        async getTranslator(sourceLanguage: string, targetLanguage: string) {

            if (sourceLanguage === 'auto') {
                
                sourceLanguage = 'en';
                console.log('Auto detection not supported, defaulting to:', sourceLanguage);
            }
        
            const key = `${sourceLanguage}-${targetLanguage}`;
            
            try {
                // @ts-expect-error - Chrome AI types
                const capabilities = await self.ai.translator.capabilities();
                
                
                const canTranslate = await capabilities.languagePairAvailable(
                    sourceLanguage,
                    targetLanguage
                );
        
                if (!canTranslate) {
                    throw new Error(`Translation not supported for ${sourceLanguage} to ${targetLanguage}`);
                }
        
                // @ts-expect-error - Chrome AI types
                const translator = await self.ai.translator.create({
                    sourceLanguage,
                    targetLanguage
                });
        
                this.translators.set(key, translator);
                return translator;
            } catch (error) {
                console.error('Translation initialization failed:', {
                    sourceLanguage,
                    targetLanguage,
                    error
                });
                throw error;
            }
        }
    
        async translate(
        text: string,
        sourceLanguage: string,
        targetLanguage: string
        ): Promise<TranslatorResult> {
        try {
            if (!text) {
            throw new Error('Text to translate cannot be empty');
            }
    
            const translator = await this.getTranslator(sourceLanguage, targetLanguage);
            
            if (!translator) {
            throw new Error('Translator is undefined');
            }
    
            const result = await translator.translate(text);
            
            if (!result) {
            throw new Error('Translation result is empty');
            }
    
            return {
            translatedText: result
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown translation error';
            console.error('Translation failed:', error);
            throw new Error(`Failed to translate text: ${errorMessage}`);
        }
        }
    }
