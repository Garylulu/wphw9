import { Input, Tabs, Modal, Form } from 'antd';

const ChatModal = ({ open, onCreate, onCancel }) => {
	const [form] = Form.useForm();
	return (
		<Modal
			open={open}
			title="Create a new chat room"
			onOk={() => {
				form.validateFields().then((values) => {
					form.resetFields();
					onCreate(values);
				}).catch((e) => {
					window.alert(e);
				})
			}}
			onCancel={onCancel}
		>
			<Form form={form} layout="vertical" name='form_in_modal'>
				<Form.Item name="name" label="Name" rules={[
					{
						required: true,
						message: 'Error: Please enter the name of the person to chat!'
					}
				]}>
				<Input />
				</Form.Item>
			</Form>
		</Modal>
	)
};

export default ChatModal;