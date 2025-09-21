import { useLanguage } from '../context/LanguageContext';

const TestLanguageContext = () => {
    const { language, toggleLanguage } = useLanguage();

    return (
        <div className="p-4">
            <h2>Language Context Test</h2>
            <p>Current Language: {language}</p>
            <button
                className="btn btn-primary me-2"
                onClick={() => toggleLanguage('en')}
            >
                English
            </button>
            <button
                className="btn btn-secondary"
                onClick={() => toggleLanguage('ar')}
            >
                العربية
            </button>
        </div>
    );
};

export default TestLanguageContext;