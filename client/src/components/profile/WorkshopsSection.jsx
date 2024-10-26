import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Book, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import WorkshopCard from "./WorkshopCard";

const WorkshopsSection = ({ workshops, setWorkshops }) => {
  const [editingItemId, setEditingItemId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentWorkshops = workshops.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(workshops.length / itemsPerPage);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-customBrown flex items-center">
          <Book className="w-6 h-6 mr-2" />
          الورشات
        </h3>
        <Link
          to="/add-content"
          className="flex items-center bg-customGreen text-white px-4 py-2 rounded-full hover:bg-customBrown transition duration-300"
        >
          <Plus className="w-5 h-5 mr-1" /> إضافة ورشة
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentWorkshops.map(workshop => (
          <WorkshopCard
            key={workshop.id}
            workshop={workshop}
            isEditing={editingItemId === workshop.id}
            setEditingItemId={setEditingItemId}
            setWorkshops={setWorkshops}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center space-x-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-customBrown text-white px-3 py-1 rounded-full hover:bg-customGreen transition duration-300 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <span className="text-customBrown font-semibold">
            صفحة {currentPage} من {totalPages}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-customBrown text-white px-3 py-1 rounded-full hover:bg-customGreen transition duration-300 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkshopsSection;
