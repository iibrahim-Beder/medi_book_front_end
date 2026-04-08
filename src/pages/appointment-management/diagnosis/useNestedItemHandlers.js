import { useCallback } from "react";
export const useNestedItemHandlers = (editingDiagnosis, setEditingDiagnosis ) => {
  
  // Handle cancel for nested items
  const handleCancelNestedItem = useCallback((itemType, itemId) => {
    if (!editingDiagnosis) return;
   
    const item = editingDiagnosis[itemType]?.find(item => item.id === itemId);
   
    if (item?.isNew) {
      // Remove new item
      const updatedItems = editingDiagnosis[itemType].filter(item => item.id !== itemId);
      setEditingDiagnosis(prev => ({
        ...prev,
        [itemType]: updatedItems
      }));
    } else {
      // Collapse existing item
      const updatedItems = editingDiagnosis[itemType].map(item =>
        item.id === itemId ? { ...item, isExpanded: false } : item
      );
      setEditingDiagnosis(prev => ({
        ...prev,
        [itemType]: updatedItems
      }));
    }
  }, [editingDiagnosis, setEditingDiagnosis]);

  return {
    handleCancelNestedItem
  };
};