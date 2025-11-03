import React, { useState, useEffect } from "react";
import SectionTitle from "../../shareds/SectionTitle";
import "./PaymentInsuranceStep.css";
import {
  FaMoneyBillWave,
  FaCreditCard,
  FaUniversity,
  FaHandHoldingMedical,
  FaSearch,
  FaPlusCircle,
  FaInfoCircle,
  FaCheck,
} from "react-icons/fa";
import { PiMoneyWavyLight } from "react-icons/pi";
import { useTranslation } from "react-i18next";

const PaymentInsuranceStep = ({ formData, handleInputChange, handleCheckboxChange, errors, setErrors }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newCompanyData, setNewCompanyData] = useState({ 
    name: "", 
    code: "", 
    type: "" 
  });
  const [newCompanyErrors, setNewCompanyErrors] = useState({});
  const { t } = useTranslation();
  
  // State for insurance companies (would typically come from API)
  const [insuranceCompanies, setInsuranceCompanies] = useState([]);

  // Simulate API call to fetch insurance companies
  useEffect(() => {
    const fetchInsuranceCompanies = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // This would typically be an API response
        const mockCompanies = [
          { id: 1, name: "بوبا العربية", code: "Bupa", type: "التأمين الطبي" },
          { id: 2, name: "المتوسط والخليج", code: "MedGulf", type: "تأمين صحي" },
          { id: 3, name: "الاتحاد للتأمين", code: "TUIC", type: "تأمين طبي" },
          { id: 4, name: "أكسا", code: "AXA", type: "التأمين الصحي" },
          { id: 5, name: "الشرقية", code: "SAICO", type: "تأمين طبي" },
          { id: 6, name: "الولاء للتأمين", code: "Walaa", type: "تأمين صحي" },
          { id: 7, name: "ملاذ للتأمين", code: "Malath", type: "التأمين الطبي" },
          { id: 8, name: "الخليجية", code: "GIG", type: "تأمين صحي" }
        ];
        
        setInsuranceCompanies(mockCompanies);
      } catch (error) {
        console.error("Failed to fetch insurance companies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsuranceCompanies();
  }, []);

  const paymentMethods = [
    {
      id: "cash",
      name: "cash",
      label: t("paymentMethods.cash.label"),
      description: t("paymentMethods.cash.description"),
      icon: <FaMoneyBillWave />
    },
    {
      id: "card",
      name: "card",
      label: t("paymentMethods.card.label"),
      description: t("paymentMethods.card.description"),
      icon: <FaCreditCard />
    },
    {
      id: "bankTransfer",
      name: "bankTransfer",
      label: t("paymentMethods.bankTransfer.label"),
      description: t("paymentMethods.bankTransfer.description"),
      icon: <FaUniversity />
    },
    {
      id: "insurance",
      name: "insurance",
      label: t("paymentMethods.insurance.label"),
      description: t("paymentMethods.insurance.description"),
      icon: <FaHandHoldingMedical />
    }
  ];

  const filteredCompanies = insuranceCompanies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateNewCompany = () => {
    const newErrors = {};
    
    if (!newCompanyData.name.trim()) {
      newErrors.name = t("paymentMethods.validation.companyNameRequired");
    }
    
    if (!newCompanyData.code.trim()) {
      newErrors.code = t("paymentMethods.validation.companyCodeRequired");
    }
    
    if (!newCompanyData.type) {
      newErrors.type = t("paymentMethods.validation.companyTypeRequired");
    }
    
    setNewCompanyErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCompany = () => {
    if (!validateNewCompany()) return;
    
    // In a real application, this would be an API call
    const newCompany = {
      id: Math.max(...insuranceCompanies.map(c => c.id), 0) + 1,
      ...newCompanyData
    };
    
    setInsuranceCompanies([...insuranceCompanies, newCompany]);
    
    // Show success message
    alert(`${t("paymentMethods.addCompanySuccess")} ${newCompanyData.name}`);
    
    // Reset form
    setNewCompanyData({ name: "", code: "", type: "" });
    setNewCompanyErrors({});
    setShowAddCompany(false);
  };

  const handleNewCompanyChange = (e) => {
    const { name, value } = e.target;
    setNewCompanyData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is updated
    if (newCompanyErrors[name]) {
      setNewCompanyErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handlePaymentMethodSelect = (methodId) => {
    const simulatedEvent = {
      target: {
        type: 'checkbox',
        name: "paymentMethods",
        value: methodId,
        checked: !formData.paymentMethods?.includes(methodId)
      }
    };
    handleCheckboxChange(simulatedEvent);
    
    // Clear error when a payment method is selected
    if (errors.paymentMethods) {
      setErrors(prev => ({ ...prev, paymentMethods: "" }));
    }
  };

  const handleInsuranceCompanySelect = (companyId) => {
    const simulatedEvent = {
      target: {
        type: 'checkbox',
        name: "insuranceCompanies",
        value: companyId.toString(),
        checked: !formData.insuranceCompanies?.includes(companyId.toString())
      }
    };
    handleCheckboxChange(simulatedEvent);
  };

  return (
    <div className="payment-insurance-step">
      <SectionTitle
        icon={<PiMoneyWavyLight />}
        title={t("paymentMethods.title")}
      />
      
      <div className="info-banner">
        <FaInfoCircle />
        <span>{t("paymentMethods.infoBanner")}</span>
      </div>
      
      {/* Payment Methods */}
      <div className="form-section payment-methods">
        <h3 className="subsection-title">
          <FaMoneyBillWave />
          {t("paymentMethods.acceptedMethods")}
        </h3>
        
    
        
        <div className="methods-grid">
          {paymentMethods.map(method => (
            <div 
              className={`method-card ${formData.paymentMethods?.includes(method.id) ? 'selected' : ''}`} 
              key={method.id}
              onClick={() => handlePaymentMethodSelect(method.id)}
              role="checkbox"
              aria-checked={formData.paymentMethods?.includes(method.id)}
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePaymentMethodSelect(method.id);
                }
              }}
            >
              <div className="method-icon">{method.icon}</div>
              <div className="method-content">
                <h4>{method.label}</h4>
                <p>{method.description}</p>
              </div>
              <div className="checkmark">
                {formData.paymentMethods?.includes(method.id) && <FaCheck />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insurance Companies */}
      <div className="form-section insurance-companies">
        <h3 className="subsection-title">
          <FaHandHoldingMedical />
          {t("paymentMethods.insuranceCompanies")}
        </h3>
        
        <p className="section-description">
          {t("paymentMethods.insuranceDescription")}
        </p>
        
        <div className="search-container">
          <div className="search-field">
            <FaSearch className="search-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("paymentMethods.searchPlaceholder")}
              className="search-input"
              aria-label={t("paymentMethods.searchPlaceholder")}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="loading-state">
            <p>{t("common.loading")}</p>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="no-results">
            <p>{t("paymentMethods.noResults")}</p>
          </div>
        ) : (
          <div className="companies-grid">
            {filteredCompanies.map(company => (
              <div 
                className={`company-card ${formData.insuranceCompanies?.includes(company.id.toString()) ? 'selected' : ''}`}
                key={company.id}
                onClick={() => handleInsuranceCompanySelect(company.id)}
                role="checkbox"
                aria-checked={formData.insuranceCompanies?.includes(company.id.toString())}
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleInsuranceCompanySelect(company.id);
                  }
                }}
              >
                <div className="company-info">
                  <h4>{company.name}</h4>
                  <span className="company-code">{company.code}</span>
                  <span className="company-type">{company.type}</span>
                </div>
                <div className="checkmark">
                  {formData.insuranceCompanies?.includes(company.id.toString()) && <FaCheck />}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Add New Insurance Company */}
        <div className="add-company-section">
          <button 
            type="button" 
            className="add-company-toggle"
            onClick={() => setShowAddCompany(!showAddCompany)}
            aria-expanded={showAddCompany}
          >
            <FaPlusCircle />
            {t("paymentMethods.addNewCompany")}
          </button>
          
          {showAddCompany && (
            <div className="add-company-form">
              <h4>{t("paymentMethods.addNewCompanyTitle")}</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="company-name">{t("paymentMethods.companyName.label")}</label>
                  <input
                    type="text"
                    id="company-name"
                    name="name"
                    value={newCompanyData.name}
                    onChange={handleNewCompanyChange}
                    placeholder={t("paymentMethods.companyName.placeholder")}
                    className={`form-control ${newCompanyErrors.name ? 'error' : ''}`}
                    aria-invalid={!!newCompanyErrors.name}
                    aria-describedby={newCompanyErrors.name ? "company-name-error" : undefined}
                  />
                  {newCompanyErrors.name && (
                    <span id="company-name-error" className="error-text">{newCompanyErrors.name}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="company-code">{t("paymentMethods.companyCode.label")}</label>
                  <input
                    type="text"
                    id="company-code"
                    name="code"
                    value={newCompanyData.code}
                    onChange={handleNewCompanyChange}
                    placeholder={t("paymentMethods.companyCode.placeholder")}
                    className={`form-control ${newCompanyErrors.code ? 'error' : ''}`}
                    aria-invalid={!!newCompanyErrors.code}
                    aria-describedby={newCompanyErrors.code ? "company-code-error" : undefined}
                  />
                  {newCompanyErrors.code && (
                    <span id="company-code-error" className="error-text">{newCompanyErrors.code}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="company-type">{t("paymentMethods.companyType.label")}</label>
                  <select
                    id="company-type"
                    name="type"
                    value={newCompanyData.type}
                    onChange={handleNewCompanyChange}
                    className={`form-control ${newCompanyErrors.type ? 'error' : ''}`}
                    aria-invalid={!!newCompanyErrors.type}
                    aria-describedby={newCompanyErrors.type ? "company-type-error" : undefined}
                  >
                    <option value="">{t("paymentMethods.companyType.select")}</option>
                    <option value="medical">{t("paymentMethods.companyType.medical")}</option>
                    <option value="health">{t("paymentMethods.companyType.health")}</option>
                    <option value="dental">{t("paymentMethods.companyType.dental")}</option>
                  </select>
                  {newCompanyErrors.type && (
                    <span id="company-type-error" className="error-text">{newCompanyErrors.type}</span>
                  )}
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={handleAddCompany}
                >
                  {t("paymentMethods.addCompanyButton")}
                </button>
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => {
                    setShowAddCompany(false);
                    setNewCompanyErrors({});
                  }}
                >
                  {t("common.cancel")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>


    </div>
  );
};

export default PaymentInsuranceStep;