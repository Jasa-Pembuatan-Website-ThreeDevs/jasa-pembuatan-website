import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Data anggota tim
const teamMembers = [
    {
        id: 1,
        name: "Dannys Martha Favrillia",
        role: "Frontend Developer",
        bio: "Spesialis dalam React dan Vue.js dengan pengalaman 5 tahun membangun aplikasi web responsif. Passionate tentang UI/UX design dan performance optimization.",
        favoriteTech: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
        email: "webdannys@gmail.com",
        joinedDate: "2025-03-15",
        projectsCompleted: 42,
        avatarColor: "bg-indigo-100",
        textColor: "text-indigo-800"
    },
    {
        id: 2,
        name: "Arya Prana Jaya",
        role: "Backend Developer",
        bio: "Menciptakan pengalaman pengguna yang intuitif dan menarik dengan pendekatan user-centered design. Berpengalaman dalam design system dan prototyping.",
        favoriteTech: ["Laravel", "Golang"],
        email: "agung@gmail.com",
        joinedDate: "2025-08-22",
        projectsCompleted: 38,
        avatarColor: "bg-pink-100",
        textColor: "text-pink-800"
    },
    {
        id: 3,
        name: "Akbar Alfatah Rizki Syabekti",
        role: "Frontend Developer",
        bio: "Ahli dalam arsitektur backend scalable dengan fokus pada sistem microservices. Berpengalaman dengan Node.js, Python, dan cloud infrastructure.",
        favoriteTech: ["HTML", "CSS", "JavaScript"],
        email: "akbar@gmail.com",
        joinedDate: "2025-11-10",
        projectsCompleted: 56,
        avatarColor: "bg-cyan-100",
        textColor: "text-cyan-800"
    }
];

// Komponen kartu anggota tim
const TeamMemberCard = ({ member, onViewDetails }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100">
            <div className="p-6">
                <div className="flex items-center mb-4">
                    <div
                        className={`${member.avatarColor} w-16 h-16 rounded-full flex items-center justify-center mr-4`}
                    >
                        <span
                            className={`text-2xl font-bold ${member.textColor}`}
                        >
                            {member.name
                                .split(" ")
                                .map(n => n[0])
                                .join("")}
                        </span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">
                            {member.name}
                        </h3>
                        <p className="text-indigo-600 font-medium">
                            {member.role}
                        </p>
                    </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">{member.bio}</p>

                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Teknologi Favorit
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {member.favoriteTech.map((tech, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        <span className="font-medium">
                            {member.projectsCompleted}
                        </span>{" "}
                        proyek selesai
                    </div>
                    <button
                        onClick={() => onViewDetails(member)}
                        className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Lihat Detail
                    </button>
                </div>
            </div>
        </div>
    );
};

// Modal detail anggota tim
const MemberDetailModal = ({ member, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center">
                            <div
                                className={`${member.avatarColor} w-20 h-20 rounded-full flex items-center justify-center mr-4`}
                            >
                                <span
                                    className={`text-3xl font-bold ${member.textColor}`}
                                >
                                    {member.name
                                        .split(" ")
                                        .map(n => n[0])
                                        .join("")}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">
                                    {member.name}
                                </h3>
                                <p className="text-indigo-600 font-medium text-lg">
                                    {member.role}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            &times;
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                Tentang
                            </h4>
                            <p className="text-gray-600">{member.bio}</p>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                Teknologi Favorit
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {member.favoriteTech.map((tech, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1.5 bg-indigo-50 text-indigo-700 font-medium rounded-lg"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                    Email
                                </h5>
                                <p className="text-gray-800 font-medium">
                                    {member.email}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                    Bergabung
                                </h5>
                                <p className="text-gray-800 font-medium">
                                    {new Date(
                                        member.joinedDate
                                    ).toLocaleDateString("id-ID", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="bg-indigo-50 p-4 rounded-lg">
                            <h5 className="text-sm font-semibold text-indigo-800 uppercase tracking-wider mb-1">
                                Proyek Selesai
                            </h5>
                            <div className="flex items-end">
                                <span className="text-3xl font-bold text-indigo-700">
                                    {member.projectsCompleted}
                                </span>
                                <span className="text-indigo-600 ml-2 mb-1">
                                    proyek
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Komponen utama
const TeamPage = () => {
    const [selectedMember, setSelectedMember] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewDetails = member => {
        setSelectedMember(member);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {/* Header */}
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 py-6">
              <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Anggota Kami </h1>
          </div>
                {/* Statistik */}
                <div className="mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
                            <h3 className="text-2xl font-bold">
                                {teamMembers.length}
                            </h3>
                            <p className="text-indigo-100">Anggota Tim</p>
                        </div>
                        <div className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-800">
                                {teamMembers.reduce(
                                    (total, member) =>
                                        total + member.projectsCompleted,
                                    0
                                )}
                            </h3>
                            <p className="text-gray-600">
                                Total Proyek Selesai
                            </p>
                        </div>
                        <div className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-800">
                                {new Date().getFullYear() - 2018}
                            </h3>
                            <p className="text-gray-600">Tahun Pengalaman</p>
                        </div>
                    </div>
                </div>

                {/* Daftar Anggota Tim */}
                <div>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Anggota Tim
                        </h2>
                        <div className="text-sm text-gray-500">
                            <span className="font-medium">
                                {teamMembers.length}
                            </span>{" "}
                            orang
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {teamMembers.map(member => (
                            <TeamMemberCard
                                key={member.id}
                                member={member}
                                onViewDetails={handleViewDetails}
                            />
                        ))}
                    </div>
                </div>

                {/* Informasi tambahan */}
                <div className="mt-16 p-8 bg-gradient-to-r from-indigo-50 to-white border border-indigo-100 rounded-2xl">
                    <div className="max-w-3xl mx-auto text-center">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                            Tertarik Bergabung dengan Tim Kami?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Kami selalu mencari talenta-talenta berbakat untuk
                            bergabung dalam perjalanan kami menciptakan solusi
                            teknologi yang inovatif.
                        </p>
                        <button className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg border-2 border-indigo-200 hover:bg-indigo-50 transition-colors shadow-md">
                            Lihat Lowongan Pekerjaan
                        </button>
                    </div>
                </div>
            </main>

            {/* Modal Detail */}
            {selectedMember && (
                <MemberDetailModal
                    member={selectedMember}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                />
            )}
        </>
    );
};

export default TeamPage;
