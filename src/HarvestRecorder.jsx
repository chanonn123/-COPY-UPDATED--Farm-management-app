import { useState } from 'react';
import { Table, Button } from 'react-bootstrap';

const HarvestRecorder = ({ harvestRecords, setHarvestRecords, addHarvestRecord, deleteHarvestRecord, updateHarvestRecord }) => {
    const [crop, setCrop] = useState('');
    const [quantity, setQuantity] = useState('');
    const [editingRecordId, setEditingRecordId] = useState(null);

    const handleAddOrUpdateRecord = () => {
        if (crop.trim() && quantity.trim()) {
            const newRecord = { crop, quantity };

            if (editingRecordId) {
                updateHarvestRecord({ id: editingRecordId, ...newRecord });
                setEditingRecordId(null);
            } else {
                addHarvestRecord(newRecord);
            }
            setCrop('');
            setQuantity('');
        }
    };

    const handleDeleteRecord = async (index) => {
        const recordId = harvestRecords[index].id;
        await deleteHarvestRecord(recordId);
        setHarvestRecords(harvestRecords.filter((_, i) => i !== index));
    };

    const handleEditRecord = (record) => {
        setCrop(record.crop);
        setQuantity(record.quantity);
        setEditingRecordId(record.id);
    };

    return (
        <div className="harvest-recorder-container">
            <input
                type="text"
                placeholder="Crop Name"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="form-control mb-2"
            />
            <input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="form-control mb-2"
            />
            <Button variant={editingRecordId ? "primary" : "success"} onClick={handleAddOrUpdateRecord}>
                {editingRecordId ? "Update Record" : "Add Record"}
            </Button>

            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Crop</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {harvestRecords.map((record, index) => (
                        <tr key={record.id}>
                            <td>{index + 1}</td>
                            <td>{record.crop}</td>
                            <td>{record.quantity}</td>
                            <td>
                                <Button variant="info" onClick={() => handleEditRecord(record)}>
                                    Edit
                                </Button>
                                <Button variant="danger" onClick={() => handleDeleteRecord(index)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default HarvestRecorder;
