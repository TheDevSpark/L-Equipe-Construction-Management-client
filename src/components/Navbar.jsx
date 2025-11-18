// Header.jsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import { useAuth } from "@/context/AuthContext";

export default function Header({ onMenuToggle }) {
  const pathname = usePathname();
  const {user} = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-60">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and Project */}
        <div className="flex items-center space-x-3">
          {/* Mobile Menu Button - Left side */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base sm:text-lg font-medium text-gray-800">
              ProBuild PM
            </h1>
            <p className="text-xs text-gray-500">Downtown Office Complex</p>
          </div>
        </div>

        {/* Right side - User Profile / Auth */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Search Icon - Mobile */}
          <button className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2 text-gray-700 bg-gray-100 px-3 py-2 rounded-lg">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-sm font-medium">{`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email}</span>
                <LogoutButton />
              </div>
            ) : (
              <a href="/login" className="inline-flex items-center text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg cursor-pointer">Sign in</a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
