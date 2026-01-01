import { Row, Col, InputGroup, Form, Button } from "react-bootstrap";
import { Search, Plus } from "lucide-react";

const PatientToolbar = ({ search, setSearch, onAdd }) => {
  return (
    <Row className="mb-3">
      <Col md={6}>
        <InputGroup>
          <InputGroup.Text>
            <Search size={18} />
          </InputGroup.Text>
          <Form.Control
            placeholder="ابحث باسم المريض أو رقم الهاتف"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </Col>
      <Col md={6} className="text-end">
        <Button onClick={onAdd} className="d-flex align-items-center gap-1">
          <Plus size={18} /> إضافة مريض
        </Button>
      </Col>
    </Row>
  );
};

export default PatientToolbar;
