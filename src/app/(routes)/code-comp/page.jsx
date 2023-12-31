"use client"
// CreateCodeComponentForm.js
import Container from '@/components/homeLayout/Container';
import Message from '@/components/comLayout/create-code-comp/Message';
import CreateCompForm from '@/components/comLayout/create-code-comp/CreateCompForm';
import useCreateForm from '@/hooks/useCreateForm';

const CreateCodeComponentForm = () => {
    // const apiUrl = process.env.NEXT_PUBLIC_NEXUS_URL + "/api/code-components/" || "http://localhost:8000/api/code-components/";
    // const apiUrl = "http://localhost:8000/api/code-components/";
    // const apiUrl = "https://devnexus-server.onrender.com/api/code-components/";
    const apiUrl = process.env.NEXT_PUBLIC_NEXUS_URL+"/api/code-components/";
    const initialFormData = {
        title: '',
        description: '',
        code: '<div className="flex items-center p-4 justify-center h-[50vh]">\n\t\t//code here \n</div>',
    };

    const {
        formData,
        loading,
        successMessage,
        errorMessage,
        handleInputChange,
        handleSubmit,
        resetForm,
    } = useCreateForm(initialFormData, apiUrl);

    const handleCodeInputChange = (newCode) => {
        handleInputChange({ target: { name: 'code', value: newCode } });
    };

    const closeMessage = () => {
        // Include this function to close the message
        resetForm('');
    };


    return (
        <Container>
            {/* Form */}
            <CreateCompForm
                formData={formData}
                codeInput={formData.code}
                loading={loading}
                handleInputChange={handleInputChange}
                handleCodeInputChange={handleCodeInputChange}
                handleSubmit={handleSubmit}
            />

            {/* Display success and error messages with animations */}
            {successMessage && <Message type="success" message={successMessage} onClose={closeMessage} />}
            {errorMessage && <Message type="error" message={errorMessage} onClose={closeMessage} />}
        </Container>
    );
};

export default CreateCodeComponentForm;
